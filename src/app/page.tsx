import MarkdownEditor from "@/components/editor";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <MarkdownEditor
        initialContent="## Hello World"
        onSave={(markdown) => {
          console.log(markdown);
          return true;
        }}
      />
    </div>
  );
}
