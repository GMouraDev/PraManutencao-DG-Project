import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documentsByFolder } from "@/data/documentsList";
import { useState, useMemo } from "react";

interface DocumentModalProps {
  folderPath: string;
  folderName: string;
  onClose: () => void;
}

// Lista de documentos importada de documentsList.ts (gerado automaticamente pelo script generate-documents-list.cjs)

// Função para extrair a placa do nome do arquivo
// Exemplo: "TAR0B54 (2).pdf" -> "TAR0B54"
const extractPlate = (fileName: string): string => {
  // Remove a extensão .pdf
  const withoutExt = fileName.replace(/\.pdf$/i, '');
  // Remove qualquer coisa entre parênteses e espaços extras
  const plate = withoutExt.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return plate.toUpperCase();
};

export function DocumentModal({ folderPath, folderName, onClose }: DocumentModalProps) {
  const documents = documentsByFolder[folderPath] || [];
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar documentos por placa
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents;
    }
    const query = searchQuery.toUpperCase().trim();
    return documents.filter(doc => {
      const plate = extractPlate(doc);
      return plate.includes(query);
    });
  }, [documents, searchQuery]);

  const getDocumentUrl = (fileName: string) => {
    // Caminho para arquivos estáticos em public/data/CRLVS
    return `/data/CRLVS/${folderPath}/${encodeURIComponent(fileName)}`;
  };

  const handleDocumentClick = (fileName: string) => {
    const url = getDocumentUrl(fileName);
    // Abrir em nova aba para visualização
    window.open(url, "_blank");
  };

  const handleDownload = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getDocumentUrl(fileName);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {folderName} - Documentos CRLV
          </DialogTitle>
        </DialogHeader>

        {/* Barra de pesquisa por placa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por placa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum documento encontrado nesta pasta.</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum documento encontrado com a placa "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/40 border-primary/20"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 border border-primary/20">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" title={doc}>
                            {doc}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">PDF Document</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={(e) => handleDownload(doc, e)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

