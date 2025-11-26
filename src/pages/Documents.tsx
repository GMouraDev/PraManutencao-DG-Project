import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { DocumentModal } from "@/components/DocumentModal";
import { folders } from "@/data/documentsList";
import { Input } from "@/components/ui/input";

export default function Documents() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFolderClick = (folderPath: string) => {
    setSelectedFolder(folderPath);
  };

  const handleCloseModal = () => {
    setSelectedFolder(null);
  };

  // Filtrar pastas baseado na pesquisa
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) {
      return folders;
    }
    const query = searchQuery.toLowerCase();
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Documentos Veículo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Selecione uma pasta para visualizar os documentos CRLV disponíveis
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar pasta por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredFolders.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nenhuma pasta encontrada com o termo "{searchQuery}"</p>
            </div>
          ) : (
            filteredFolders.map((folder) => (
            <Card
              key={folder.path}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20"
              onClick={() => handleFolderClick(folder.path)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg flex-shrink-0">
                    <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground truncate">
                      {folder.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      CRLV Documents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {selectedFolder && (
          <DocumentModal
            folderPath={selectedFolder}
            folderName={folders.find(f => f.path === selectedFolder)?.name || selectedFolder}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
