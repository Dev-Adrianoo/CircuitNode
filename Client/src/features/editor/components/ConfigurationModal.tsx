import React, { useState, useEffect } from "react";
import { type Node } from "reactflow";
import { Button } from "@/ui/button"
import type { AnyComponentData, ResistorData } from "@/core/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { Input } from "@/ui/input";
import { Label } from "@/ui/label";


interface ConfigurationModalProps {
  node: Node | null;
  onSave: (node: Node, data: AnyComponentData) => void;
  onClose: () => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ node, onSave, onClose }) => {

  const [formData, setFormData] = useState<AnyComponentData | {}>({});

  useEffect(() => {

    if (node) {
      setFormData(node.data);
    }
  }, [node])

  if (!node) return null;

  const handleSave = () => {
    onSave(node, formData as AnyComponentData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }

  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, color: value }))
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
              <Label htmlFor="resistance" className="text-right">Resistência (Ω)</Label>
              <Input
                id="resistance"
                name="resistance"
                type="number"
                value={(formData as ResistorData).resistance || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          )}


          {node.type === "led" && (
            <div className="grid grid-cols-4 w-full items-center gap-4">
              <Label htmlFor="color" className="text-right">Cor</Label>
              <Select
                name="color"
                value={(formData as { color?: string }).color || 'red'}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
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