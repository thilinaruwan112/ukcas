
import { Skeleton } from "@/components/ui/skeleton";

export default function InstitutesLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="h-12 w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
            <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
