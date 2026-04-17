'use client';

import '@/styles/job-application.css';
import { useState } from 'react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import Icons from '@/components/Icons';
import type { Job } from '@/libs/models/job';

type JobApplicationFormProps = {
  job: Job | null;
  locale: 'en' | 'ar';
};

const COPY = {
  en: {
    pageTitle: 'Apply ',
    intro: 'Submit your details and CV to apply for this role. Our team will review your application and contact shortlisted candidates.',
    unavailable: 'This job is not available.',
    unavailableText: 'The job you selected could not be found. Please return to the careers page and choose another listing.',
    back: 'Back to Careers',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    linkedin: 'LinkedIn URL',
    message: 'Cover Letter / Message',
    resume: 'Upload CV / Resume',
    resumeHelp: 'Accepted formats: PDF, DOC, DOCX. Max 10MB.',
    sending: 'Submitting...',
    submit: 'Submit Application',
  },
  ar: {
    pageTitle: 'التقديم على الوظيفة',
    intro: 'أرسل بياناتك وسيرتك الذاتية للتقديم على هذه الوظيفة. سيقوم فريقنا بمراجعة الطلب والتواصل مع المرشحين المناسبين.',
    unavailable: 'هذه الوظيفة غير متاحة.',
    unavailableText: 'تعذر العثور على الوظيفة التي اخترتها. يرجى العودة إلى صفحة الوظائف واختيار وظيفة أخرى.',
    back: 'العودة إلى الوظائف',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    linkedin: 'رابط لينكدإن',
    message: 'رسالة / خطاب تقديم',
    resume: 'رفع السيرة الذاتية',
    resumeHelp: 'الملفات المسموحة: PDF و DOC و DOCX. الحد الأقصى 10MB.',
    sending: 'جارٍ الإرسال...',
    submit: 'إرسال الطلب',
  },
} as const;

const JobApplicationForm = ({ job, locale }: JobApplicationFormProps) => {
  const copy = COPY[locale];
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const careersHref = locale === 'ar' ? '/ar/careers' : '/careers';

  if (!job) {
    return (
      <section className="job-application-page job-application-empty">
        <div className="container">
          <div className="job-application-wrap">
            <div className="job-application-card radius18">
              <h1 className="heading text-40">{copy.unavailable}</h1>
              <p className="text text-18">{copy.unavailableText}</p>
              <div className="job-application-actions">
                <PrimaryButton label={copy.back} href={careersHref} ariaLabel={copy.back} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const title = locale === 'ar' && job.titleAr ? job.titleAr : job.title;
  const department = locale === 'ar' && job.departmentAr ? job.departmentAr : job.department;
  const location = locale === 'ar' && job.locationAr ? job.locationAr : job.location;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setStatus('success');
        setMessage(result.message || 'Application submitted successfully.');
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to submit application.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="job-application-page section-padding">
      <div className="container">
        <div className="job-application-wrap">
          <div className="job-application-card radius18">
            <div className="section-headings">
              {/* <h1 className="heading text-50">{copy.pageTitle}</h1> */}
              <h2 className="heading text-32 fw-600" style={{ marginTop: '12px' }}>{title}</h2>
              <p className="text text-18" style={{ marginTop: '12px' }}>{copy.intro}</p>
            </div>

          

            <form className="job-application-grid" onSubmit={handleSubmit}>
              <input type="hidden" name="jobId" value={String(job._id || job.id || '')} />
              <input type="hidden" name="jobTitle" value={job.title} />
              <input type="hidden" name="jobTitleAr" value={job.titleAr || ''} />

              <div className="job-application-field">
                <label htmlFor="applicantName">{copy.name}</label>
                <input id="applicantName" name="applicantName" type="text" required />
              </div>

              <div className="job-application-field">
                <label htmlFor="email">{copy.email}</label>
                <input id="email" name="email" type="email" required />
              </div>

              <div className="job-application-field">
                <label htmlFor="phone">{copy.phone}</label>
                <input id="phone" name="phone" type="text" required />
              </div>

              <div className="job-application-field">
                <label htmlFor="linkedin">{copy.linkedin}</label>
                <input id="linkedin" name="linkedin" type="url" />
              </div>

              <div className="job-application-field full">
                <label htmlFor="message">{copy.message}</label>
                <textarea id="message" name="message" required />
              </div>

              <div className="job-application-field full">
                <label htmlFor="resume">{copy.resume}</label>
                <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required />
                <span className="job-application-help">{copy.resumeHelp}</span>
              </div>

              <div className="job-application-field full">
                <div className="job-application-actions">
                  {loading ? (
                    <PrimaryButton label={copy.sending} ariaLabel={copy.sending} />
                  ) : (
                    <PrimaryButton label={copy.submit} ariaLabel={copy.submit} />
                  )}
                  {message ? (
                    <span className={`job-application-status ${status}`}>
                      {message}
                    </span>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobApplicationForm;
