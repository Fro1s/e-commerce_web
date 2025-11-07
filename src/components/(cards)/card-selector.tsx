'use client';

import { useState } from 'react';
import { useListCards } from './useListCards';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CardForm } from './card-form';

interface CardSelectorProps {
  selectedCardId: string;
  onCardSelect: (cardId: string) => void;
}

export function CardSelector({ selectedCardId, onCardSelect }: CardSelectorProps) {
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const { data: cards, isLoading, refetch } = useListCards();

  if (isLoading) {
    return <div className="text-center py-4">Carregando cartões...</div>;
  }

  const handleNewCardCreated = (cardId: string) => {
    setShowNewCardDialog(false);
    refetch();
    onCardSelect(cardId);
  };

  const cardList = cards as any[];

  return (
    <div className="space-y-4">
      {cardList && cardList.length > 0 ? (
        <>
          <RadioGroup value={selectedCardId} onValueChange={onCardSelect}>
            <div className="space-y-2">
              {cardList.map((card: any) => (
                <div
                  key={card.id}
                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCardId === card.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onCardSelect(card.id)}
                >
                  <RadioGroupItem value={card.id} id={card.id} />
                  <Label htmlFor={card.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">
                        •••• {card.last_four_digits}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {card.brand} - {card.holder_name}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Novo Cartão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cartão</DialogTitle>
              </DialogHeader>
              <CardForm onSuccess={handleNewCardCreated} />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="mb-4 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Nenhum cartão cadastrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cadastre seu primeiro cartão para continuar
            </p>
          </div>
          <CardForm onSuccess={handleNewCardCreated} />
        </div>
      )}
    </div>
  );
}
