import React, { useState, useEffect } from "react";
import { type Node } from "reactflow";
import { Button } from "@/ui/button";
import type { AnyComponentData, ResistorData, LedData } from "@/core/types"; 

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { produce } from "immer";


interface ConfigurationModalProps {
  node: Node | null;
  onSave: (node: Node, data: AnyComponentData) => void;
  onClose: () => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ node, onSave, onClose }) => {

  const [formData, setFormData] = useState<AnyComponentData | {}>({});

  useEffect(() => {
    if (node) {
      
      const initialData = produce(node.data, draft => {
        if (node.type === 'led') {
          const ledDraft = draft as LedData;
          if (!ledDraft.behavior) {
            ledDraft.behavior = { type: 'direct' };
          }
        }
      });
      setFormData(initialData);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node, formData as AnyComponentData);
  };

  
  const handleDataChange = (field: string, value: string | number) => {
    setFormData(
      produce((draft: any) => {
        const keys = field.split('.');
        let current = draft;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = value;
          } else {
            if (!current[key]) current[key] = {};
            current = current[key];
          }
        });
      })
    );
  };

  const ledData = formData as LedData;

  return (
    <Dialog open={!!node} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-200 text-black">
        <DialogHeader>
          <DialogTitle>Configurar {node.type}</DialogTitle>
          <DialogDescription>
            Faça as alterações nas propriedades do componente aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              name="label"
              value={(formData as AnyComponentData).label || ''}
              onChange={(e) => handleDataChange('label', e.target.value)}
              className="col-span-3"
            />
          </div>

          {node.type === "resistor" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resistance" className="text-right">Resistência (Ω)</Label>
              <Input
                id="resistance"
                name="resistance"
                type="number"
                value={(formData as ResistorData).resistance || 0}
                onChange={(e) => handleDataChange('resistance', parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
          )}

          {node.type === "led" && (
            <>
              <div className="grid grid-cols-4 w-full items-center gap-4">
                <Label htmlFor="color" className="text-right">Cor</Label>
                <Select
                  name="color"
                  value={ledData.color || 'red'}
                  onValueChange={(value) => handleDataChange('color', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black border">
                    <SelectItem value="red">Vermelho</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="yellow">Amarelo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 w-full items-center gap-4">
                <Label htmlFor="behavior.type" className="text-right">Modo</Label>
                <Select
                  name="behavior.type"
                  value={ledData.behavior?.type || 'direct'}
                  onValueChange={(value) => handleDataChange('behavior.type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um comportamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black border">
                    <SelectItem value="direct">Direto (On/Off)</SelectItem>
                    <SelectItem value="delay">Pulso (Duração)</SelectItem>
                    <SelectItem value="blink">Piscante (Blink)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {ledData.behavior?.type === 'delay' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="behavior.delay" className="text-right">Delay (s)</Label>
                    <Input
                      id="behavior.delay"
                      name="behavior.delay"
                      type="number"
                      value={(ledData.behavior.delay ?? 0) / 1000}
                      onChange={(e) => handleDataChange('behavior.delay', parseFloat(e.target.value) * 1000 || 0)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="behavior.duration" className="text-right">Duração (s)</Label>
                    <Input
                      id="behavior.duration"
                      name="behavior.duration"
                      type="number"
                      value={(ledData.behavior.duration ?? 1000) / 1000}
                      onChange={(e) => handleDataChange('behavior.duration', parseFloat(e.target.value) * 1000 || 0)}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}

              {ledData.behavior?.type === 'blink' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="behavior.frequency" className="text-right">Frequência (Hz)</Label>
                  <Input
                    id="behavior.frequency"
                    name="behavior.frequency"
                    type="number"
                    value={ledData.behavior.frequency ?? 1}
                    onChange={(e) => handleDataChange('behavior.frequency', parseFloat(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
              )}
            </>
          )}

        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="border"
          >Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
