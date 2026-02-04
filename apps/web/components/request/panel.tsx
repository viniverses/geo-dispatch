'use client';

import { Separator } from '@workspace/ui/components/separator';
import { useState } from 'react';
import { toast } from 'sonner';

import ServiceRequestForm, { type ServiceRequestFormData } from './form';

export const ServiceRequestPanel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: ServiceRequestFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Dados do formulário:', data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Solicitação enviada com sucesso!', {
        position: 'top-right',
      });
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-1/3 bg-background/90 backdrop-blur-sm z-10 m-4 p-6 rounded-xl shadow-2xl border border-white/10 overflow-y-auto overflow-hidden no-scrollbar">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Solicitar Assistência</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os dados abaixo para solicitar um serviço
          </p>
        </div>
        <Separator />
        <ServiceRequestForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};
