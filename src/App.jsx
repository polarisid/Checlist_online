import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import styled from 'styled-components';

const Container = styled.div`

  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #2563eb;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  padding-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
  color: #9ca3af;
`;


function App() {
  const [formData, setFormData] = useState({
    cliente: '',
    modelo: '',
    serial: '',
    dataVisita: '',
    numeroOS: '',
    tipoChecklist: 'EXCLUSAO',
    naoLiga: false,
    somOk: false,
    standby: false,
    observacoes: '',
    tecnico: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const preencherPDF = async () => {
    const baseFile = `/Checklist DTV_IH41_${formData.tipoChecklist}.pdf`;
    const existingPdfBytes = await fetch(baseFile).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text, x, y, size = 10) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0)
      });
    };

    drawText("FERNANDES E MESQUITA", 119, height - 72);
    drawText(formData.cliente, 90, height - 85);
    drawText(formData.modelo, 90, height - 100);
    drawText(formData.serial, 420, height - 87);
    drawText(formData.numeroOS, 420, height - 72);
    drawText(formData.dataVisita, 450, height - 100);
    drawText(formData.tecnico, 120, height - 800);

    if (formData.naoLiga) drawText('X', 357, height - 239);
    if (formData.somOk) drawText('X', 130, height - 250);
    if (formData.standby) drawText('X', 380, height - 250);

    drawText(formData.observacoes, 70, height - 750);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `Checklist_${formData.tipoChecklist}.pdf`);
  };

  return (
    <Container>
      <Title>Preencher Checklist</Title>

      <Select name="tipoChecklist" onChange={handleChange} value={formData.tipoChecklist}>
        <option value="EXCLUSAO">Exclusão de Garantia</option>
        <option value="NDF">Sem Defeito (NDF)</option>
        <option value="PREENCHIDO">Reparo Normal</option>
      </Select>

      <Input name="cliente" placeholder="Cliente" onChange={handleChange} />
      <Input name="modelo" placeholder="Modelo" onChange={handleChange} />
      <Input name="serial" placeholder="Serial" onChange={handleChange} />
      <Input name="numeroOS" placeholder="Nº OS" onChange={handleChange} />
      <Input name="dataVisita" placeholder="Data da Visita" onChange={handleChange} />
      <Input name="tecnico" placeholder="Técnico" onChange={handleChange} />
      <Textarea name="observacoes" placeholder="Observações" rows="4" onChange={handleChange} />

      <Button onClick={preencherPDF}>Gerar PDF</Button>
      <Footer>
  Desenvolvido por <strong>Daniel Carvalho</strong>
</Footer>
    </Container>
    
  );
}

export default App;
