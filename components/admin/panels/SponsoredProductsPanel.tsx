
import React from 'react';
import { Fieldset, TextInput } from '../AdminFormComponents';
import { SponsorApplication } from '../../../types/firestore';

interface SponsoredProductsPanelProps {
    data: any;
    onChange: (path: string, value: any) => void;
    adminContent: any;
    applications: SponsorApplication[];
    onApplicationUpdate: (appId: string, updates: Partial<SponsorApplication>) => void;
}

const SponsoredProductsPanel: React.FC<SponsoredProductsPanelProps> = ({ data, onChange, adminContent, applications, onApplicationUpdate }) => {
    const labels = adminContent.labels;

    const handleWeightChange = (appId: string, weight: string) => {
        onApplicationUpdate(appId, { win_weight: isNaN(parseInt(weight, 10)) ? 10 : parseInt(weight, 10) });
    };

    const handleApprove = (app: SponsorApplication) => {
        if (!app) return;

        const newPrize = {
            id: `sponsor_${app.id}`,
            name: app.product_name,
            image: app.product_image,
            inventory: app.quantity,
            weight: app.win_weight || 10,
            sponsoredBy: app.sponsor_company
        };

        const updatedPrizes = [...(data.gamePrizes || []), newPrize];
        onChange('gamePrizes', updatedPrizes);

        onApplicationUpdate(app.id, { status: 'approved' });
    };

    const handleReject = (appId: string) => {
        onApplicationUpdate(appId, { status: 'rejected' });
    };

    return (
        <Fieldset legend="Sponsorship Applications">
            {!applications || applications.length === 0 ? (
                <p className="text-slate-500">No sponsorship applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="p-4 border rounded-lg bg-white shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                {/* Info */}
                                <div className="md:col-span-2 flex items-center gap-4">
                                    <img src={app.product_image} alt={app.product_name} className="w-16 h-16 rounded-md object-cover bg-slate-200 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg text-slate-800">{app.product_name}</p>
                                        <p className="text-sm text-slate-500">By: {app.sponsor_company}</p>
                                        <p className="text-sm text-slate-500">Quantity: {app.quantity}</p>
                                    </div>
                                </div>
                                
                                {/* Status & Controls */}
                                <div className="md:col-span-2 space-y-2">
                                    {app.status === 'pending' ? (
                                        <div className="flex items-end gap-2">
                                            <div className="flex-grow">
                                                <TextInput 
                                                    label={labels.winWeight}
                                                    value={app.win_weight || ''}
                                                    onChange={e => handleWeightChange(app.id, e.target.value)}
                                                    placeholder="e.g., 10"
                                                />
                                            </div>
                                            <button onClick={() => handleApprove(app)} className="h-10 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 text-sm">Approve</button>
                                            <button onClick={() => handleReject(app.id)} className="h-10 px-4 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 text-sm">Reject</button>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <p className="font-semibold">Status: 
                                                <span className={`ml-2 capitalize ${app.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{app.status}</span>
                                            </p>
                                            {app.status === 'approved' && <p className="text-xs text-slate-500">Added to prize pool. Save changes to persist.</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Fieldset>
    );
};

export default SponsoredProductsPanel;