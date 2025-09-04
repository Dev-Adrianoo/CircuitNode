import React, { useState, useEffect } from "react";
import { type Node } from "reactflow";
import { Button } from "@/components/ui/button"
import type { AnyComponentData, ResistorData } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface ConfigurationModalProps {
  node: Node | null;
  onSave: (node: Node, data: AnyComponentData) => void;
  onClose: () => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ node, onSave, onClose}) => {

  const [formData, setFormData] = useState<AnyComponentData | {}>({});

  useEffect(() => {
    
    if(node) {
      setFormData(node.data);
    }
  }, [node])

  if(!node) return null;

  const handleSave = () => {
    onSave(node, formData as AnyComponentData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({...prevData, [name]: value}));
  }

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
            onChange={handleInputChange}
            className="col-span-3"
            />
          </div>

          {/* AQUI ONDE COMEÇAMOS A ADICIONAR O TIPO DE NODE () */}
          {node.type === "resistor" && (
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resistence" className="text-right">Resistência (Ω)</Label>
            <Input 
            id="resistence"
            name="resistence"
            type="number"
            value={(formData as ResistorData).resistence || 0}
            onChange={handleInputChange}
            className="col-span-3" 
            />
           </div> 
          )}

        </div>

          {/* //TODO ADICIONAR MAIS CAMPOS: RESISTENCIA ETC... */}

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