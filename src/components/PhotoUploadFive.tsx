import { useRef } from "react";

export default function PhotoUploadFive({
    images,
    setImages,
    setFiles,
    progress
}: {
    images: (string | null)[];
    setImages: React.Dispatch<React.SetStateAction<(string | null)[]>>;
    setFiles: React.Dispatch<React.SetStateAction<(File | null)[]>>;
    progress: number[];
}) {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleSelect = (index: number) => {
        inputRefs.current[index]?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFiles(prev => {
            const updated = [...prev];
            updated[index] = file;
            return updated;
        });

        const reader = new FileReader();
        reader.onload = () => {
            setImages(prev => {
                const updated = [...prev];
                updated[index] = reader.result as string;
                return updated;
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex gap-4">
            {images.map((img, index) => (
                <div key={index}
                    className="relative w-[140px] h-[160px] bg-[#FFF5D9] border-2 border-dashed border-[#C07900] rounded cursor-pointer overflow-hidden flex items-center justify-center"
                    onClick={() => handleSelect(index)}
                >
                    {img ? (
                        <img src={img} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-3xl font-bold text-[#C07900]">+</div>
                    )}

                    {/* Progress Bar */}
                    {progress[index] > 0 && progress[index] < 100 && (
                        <div className="absolute bottom-0 left-0 bg-yellow-600 h-2"
                            style={{ width: `${progress[index]}%` }} />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden" ref={(el) => {
                            inputRefs.current[index] = el!;
                        }}
                        onChange={(e) => handleFileChange(e, index)}
                    />
                </div>
            ))}
        </div>
    );
}
