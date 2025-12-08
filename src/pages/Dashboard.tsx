import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BulkUploader from "@/components/dashboard/BulkUploader";
import TranscriptionResults from "@/components/dashboard/TranscriptionResults";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { FileRecord } from "@/lib/fileUtils";

const Dashboard = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = () => {
    // Files are managed locally in state
    setIsLoading(false);
  };

  const handleFileUploaded = () => {
    loadFiles();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 pb-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-medical-dark">Dashboard</h1>
              <p className="text-gray-500">Manage your audio transcriptions</p>
            </div>
          </div>
          
          <ResizablePanelGroup 
            direction="horizontal" 
            className="min-h-[600px] rounded-lg border"
          >
            {/* Left side: Transcription Results */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="p-6 h-full bg-white">
                <h2 className="text-xl font-semibold mb-4 text-medical-dark">Transcription Results</h2>
                <TranscriptionResults 
                  files={files} 
                  onFilesChanged={loadFiles} 
                  isLoading={isLoading}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right side: File Upload */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="p-6 h-full bg-white">
                <h2 className="text-xl font-semibold mb-4 text-medical-dark">Upload Audio Files</h2>
                <BulkUploader 
                  userId="guest" 
                  onFileUploaded={handleFileUploaded} 
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;