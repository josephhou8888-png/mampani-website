


import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { contentData as seedData } from '../content';
import { useToast } from './ToastContext';
import { AllContent, SponsorApplication, Content } from '../types/firestore';
import { supabase } from '../services/supabase';

interface ContentContextType {
    allContent: AllContent | null;
    setAllContent: React.Dispatch<React.SetStateAction<AllContent | null>>;
    content: Content | null;
    isLoadingContent: boolean;
    applications: SponsorApplication[];
    language: string;
    setLanguage: (lang: string) => void;
    handleFullContentUpdate: (newContent: AllContent) => Promise<void>;
    handleSponsorApplicationSubmit: (application: Omit<SponsorApplication, 'id'>) => Promise<void>;
    handleApplicationUpdate: (appId: string, updates: any) => Promise<void>;
    dbStatus: 'checking' | 'connected' | 'error' | 'empty';
    testDbConnection: () => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allContent, setAllContent] = useState<AllContent | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [applications, setApplications] = useState<SponsorApplication[]>([]);
    const [language, setLanguage] = useState('en');
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | 'empty'>('checking');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAndSeedContent = async () => {
            setIsLoadingContent(true);
            setDbStatus('checking');
            try {
                const { data: contentRows, error: contentError } = await supabase
                    .from('website_content')
                    .select('lang, data');

                if (contentError) {
                    console.error("Error fetching content:", contentError);
                    showToast("Database connection failed. Running in offline mode.", 'error');
                    setAllContent(seedData as AllContent);
                    setDbStatus('error');
                } else if (!contentRows || contentRows.length === 0) {
                    console.log("Database is empty. Using local fallback data.");
                    showToast("Connected, but database is empty. Using local data.", 'info');
                    setAllContent(seedData as AllContent);
                    setDbStatus('empty');
                } else {
                    const fetchedContent: Partial<AllContent> = {};
                    contentRows.forEach(row => {
                        fetchedContent[row.lang as 'en' | 'ms'] = row.data;
                    });
                    setAllContent(fetchedContent as AllContent);
                    setDbStatus('connected');
                }

                const { data: applicationsData, error: applicationsError } = await supabase
                    .from('sponsor_applications')
                    .select('*');

                if (applicationsError) {
                    console.error("Error fetching applications:", applicationsError);
                    showToast("Could not load sponsor applications.", 'error');
                } else {
                    setApplications(applicationsData || []);
                }
            } catch (e) {
                console.error("A critical error occurred during content fetching:", e);
                showToast("A critical error occurred. Using local fallback data.", 'error');
                setAllContent(seedData as AllContent);
                setApplications([]);
                setDbStatus('error');
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchAndSeedContent();
    }, [showToast]);

    const handleFullContentUpdate = useCallback(async (newContent: AllContent) => {
        const updates = [
            supabase.from('website_content').update({ data: newContent.en }).eq('lang', 'en'),
            supabase.from('website_content').update({ data: newContent.ms }).eq('lang', 'ms')
        ];
        const results = await Promise.all(updates);
        const hasError = results.some(res => res.error);

        if (hasError) {
            showToast('Error saving content to the database.', 'error');
            console.error('Supabase update errors:', results.map(r => r.error).filter(Boolean));
        } else {
            setAllContent(newContent);
            showToast('Content saved successfully!', 'success');
        }
    }, [showToast]);

    const handleSponsorApplicationSubmit = useCallback(async (application: Omit<SponsorApplication, 'id'>) => {
        const { data, error } = await supabase
            .from('sponsor_applications')
            .insert([application])
            .select();

        if (error) {
            showToast('Failed to submit application.', 'error');
            console.error(error);
        } else if (data) {
            setApplications(prev => [...prev, data[0]]);
            showToast('Application submitted successfully!', 'success');
        }
    }, [showToast]);

    const handleApplicationUpdate = useCallback(async (appId: string, updates: Partial<SponsorApplication>) => {
        const { data, error } = await supabase
            .from('sponsor_applications')
            .update(updates)
            .eq('id', appId)
            .select();

        if (error) {
            showToast('Failed to update application.', 'error');
            console.error(error);
        } else if (data) {
            setApplications(prev => prev.map(app => app.id === appId ? data[0] : app));
            showToast('Application status updated!', 'info');
        }
    }, [showToast]);

    const testDbConnection = useCallback(async (): Promise<boolean> => {
        try {
            const { error } = await supabase.from('website_content').select('lang').limit(1);
            if (error) {
                throw error;
            }
            return true;
        } catch (error) {
            console.error("Database connection test failed:", error);
            return false;
        }
    }, []);

    const content = allContent ? (allContent[language] || allContent.en) : null;

    const value: ContentContextType = {
        allContent,
        setAllContent,
        content,
        isLoadingContent,
        applications,
        language,
        setLanguage,
        handleFullContentUpdate,
        handleSponsorApplicationSubmit,
        handleApplicationUpdate,
        dbStatus,
        testDbConnection,
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};