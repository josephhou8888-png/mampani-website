import React, { useState } from 'react';
import { TextInput, TextareaInput, ToggleInput, SocialLinkInput, Fieldset, ImageUploadInput } from '../AdminFormComponents';
import { useContent } from '../../../contexts/ContentContext';
import { useToast } from '../../../contexts/ToastContext';
import { SpinnerIcon } from '../../IconComponents';

const SettingsPanel = ({ data, onChange, adminContent }) => {
    const { testDbConnection } = useContent();
    const { showToast } = useToast();
    const [isTesting, setIsTesting] = useState(false);
    
    const settings = data.websiteSettings || { features: {}, socialLinks: {} };
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    const handleTestConnection = async () => {
        setIsTesting(true);
        const success = await testDbConnection();
        if (success) {
            showToast('Connection successful!', 'success');
        } else {
            showToast('Connection failed. Check console for details.', 'error');
        }
        setIsTesting(false);
    };

    return (
        <div className="space-y-6">
            <Fieldset legend="General">
                <TextInput label={labels.metaTitle} value={settings.title || ''} onChange={e => onChange('websiteSettings.title', e.target.value)} />
                <TextareaInput label={labels.metaDescription} value={settings.metaDescription || ''} onChange={e => onChange('websiteSettings.metaDescription', e.target.value)} />
            </Fieldset>
            
            <Fieldset legend="Branding">
                 <ImageUploadInput 
                    label={labels.logoUrl} 
                    value={settings.logoUrl || ''} 
                    onChange={e => onChange('websiteSettings.logoUrl', e.target.value)}
                    buttonText={actions.uploadImage}
                />
                 <TextInput label={labels.primaryColor} value={settings.primaryColor || '#059669'} onChange={e => onChange('websiteSettings.primaryColor', e.target.value)} />
            </Fieldset>
            
            <Fieldset legend="Database">
                <p className="text-sm text-slate-500 mb-2">Click the button below to perform a live test to confirm the application can connect to and query the Supabase database.</p>
                <button 
                    onClick={handleTestConnection} 
                    disabled={isTesting}
                    className="flex items-center justify-center font-semibold px-5 py-2 rounded-md bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-70"
                >
                    {isTesting ? <><SpinnerIcon className="mr-2" /> Testing...</> : 'Test Connection'}
                </button>
            </Fieldset>

            <Fieldset legend="Features">
                <ToggleInput label={labels.enableSplash} checked={settings.features?.splashEnabled === 'true'} onChange={e => onChange('websiteSettings.features.splashEnabled', e.target.checked ? 'true' : 'false')} />
                <ToggleInput label={labels.enableAIChat} checked={settings.features?.aiChatEnabled === 'true'} onChange={e => onChange('websiteSettings.features.aiChatEnabled', e.target.checked ? 'true' : 'false')} />
            </Fieldset>

            <Fieldset legend="Payment Gateway">
                <TextInput 
                    label={labels.tngApiKey} 
                    value={settings.tngApiKey || ''} 
                    onChange={e => onChange('websiteSettings.tngApiKey', e.target.value)}
                    placeholder="Enter your API key"
                />
            </Fieldset>

             <Fieldset legend="Social Media Links">
                 <SocialLinkInput socialLinks={settings.socialLinks || {}} onChange={onChange} labels={labels} />
             </Fieldset>
        </div>
    );
};

export default SettingsPanel;