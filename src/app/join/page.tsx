import { RecruitHero } from '@/components/recruit/RecruitHero';
import { DomainShowcase } from '@/components/recruit/DomainShowcase';
import { ApplicationForm } from '@/components/recruit/ApplicationForm';

export const metadata = {
  title: 'Join Us | ACM SIGGRAPH SRM',
  description: 'Apply to join the ACM SIGGRAPH SRM student chapter.',
};

export default function JoinPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <RecruitHero />
        <DomainShowcase />
        <ApplicationForm />
      </div>
    </div>
  );
}
