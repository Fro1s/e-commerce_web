'use client';

import { useAddressControllerFindAll } from '@/gen/api';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Plus } from 'lucide-react';
import { AddressDialog } from './address-dialog';
import { Badge } from '@/components/ui/badge';

interface AddressSelectorProps {
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
}

export function AddressSelector({ selectedAddressId, onAddressSelect }: AddressSelectorProps) {
  const { data, isLoading, refetch } = useAddressControllerFindAll();

  if (isLoading) {
    return <div className="text-center py-4">Carregando endereços...</div>;
  }

  // A API retorna array direto, não { data: [] }
  const addresses = Array.isArray(data) ? data : [];

  const handleNewAddressCreated = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      {addresses.length > 0 ? (
        <>
          <RadioGroup value={selectedAddressId} onValueChange={onAddressSelect}>
            <div className="space-y-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onAddressSelect(address.id)}
                >
                  <RadioGroupItem value={address.id} id={address.id} />
                  <Label htmlFor={address.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <MapPin className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {address.label || 'Endereço'}
                        </span>
                        {address.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.line_1}
                        {address.line_2 && `, ${address.line_2}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.city}/{address.state} - CEP: {address.zip_code}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <AddressDialog
            trigger={
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Novo Endereço
              </Button>
            }
            onSuccess={handleNewAddressCreated}
          />
        </>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="mb-4 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Nenhum endereço cadastrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cadastre seu primeiro endereço para continuar
            </p>
          </div>
          <AddressDialog onSuccess={handleNewAddressCreated} />
        </div>
      )}
    </div>
  );
}
