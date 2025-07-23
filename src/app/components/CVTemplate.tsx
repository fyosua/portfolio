import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Link,
} from '@react-pdf/renderer';
import { styles } from './CVTemplate.styles';

// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string | null) => {
  if (!startDate) return '';
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateStr; // Return original if parsing fails
    }
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  
  return `${start} - ${end}`;
};

// Helper Components (remain the same)
const BulletText = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.responsibilityItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.responsibilityText}>{children}</Text>
  </View>
);

const NumberedText = ({ number, children }: { number: number; children: React.ReactNode }) => (
  <View style={styles.subResponsibilityItem}>
    <Text style={styles.numberedBullet}>{number}.</Text>
    <Text style={styles.responsibilityText}>{children}</Text>
  </View>
);

const CVTemplate = ({ profile, aboutContent, experiences, education, skillsByCategory, languages, personalInfo }: any) => {
  const whatsappNumber = profile?.phone ? String(profile.phone).replace(/\+/g, '') : '';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerNameTitle}>{profile?.name}, {profile?.title}</Text>
          <View style={styles.contactInfoLine1}>
            <Link src={whatsappLink} style={styles.contactItem}>
              <Text>{profile?.phone}</Text>
            </Link>
            <Text style={styles.contactSeparator}>,</Text>
            <Link src={`mailto:${profile?.email}`} style={styles.contactItem}>
              <Text>{profile?.email}</Text>
            </Link>
            {profile?.linkedin && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={profile.linkedin} style={[styles.contactItem, styles.contactLink]}>
                  <Text>LinkedIn</Text>
                </Link>
              </>
            )}
          </View>
          <View style={styles.headerDobNationality}>
            <View style={styles.dobGroup}>
              <Text>Date of birth</Text>
              <Text style={{ marginLeft: 150 }}>{personalInfo?.dob}</Text>
            </View>
            <View style={styles.nationalityGroup}>
              <Text>Nationality</Text>
              <Text style={{ marginLeft: 150 }}>{personalInfo?.nationality}</Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{aboutContent}</Text>
        </View>

        {/* Work Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {experiences?.map((exp: any) => (
            <View key={exp.id} style={styles.experienceItem} wrap={false}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceDate}>{formatDateRange(exp.startDate, exp.endDate)}</Text>
                <View style={styles.experienceRoleCompany}>
                  <Text style={styles.experienceRole}>{exp.role}</Text>
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                  <Text style={styles.experienceCompany}>{exp.location}</Text>
                </View>
              </View>
              {exp.summary && <Text style={styles.experienceSummary}>{exp.summary}</Text>}
              {exp.responsibilities?.length > 0 && (
                <View style={styles.responsibilityList}>
                  {exp.responsibilities.map((resp: any, i: number) => (
                    <React.Fragment key={i}>
                      <BulletText>{resp.point}</BulletText>
                      {resp.subPoints?.length > 0 && (
                        <View style={styles.subResponsibilityList}>
                          {resp.subPoints.map((sub: string, j: number) => (<NumberedText key={j} number={j + 1}>{sub}</NumberedText>))}
                        </View>
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.educationItem} wrap={false}>
            <View style={styles.educationHeader}>
              <Text style={styles.educationPeriod}>{education?.period}</Text>
              <Text style={styles.educationDegree}>{education?.degree}, {education?.university}</Text>
            </View>
            <View style={styles.educationDetailList}>
              {education?.details.map((detail: string, i: number) => (<BulletText key={i}>{detail}</BulletText>))}
            </View>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {skillsByCategory?.map((category: any) => (
            <View key={category.id} style={styles.skillCategory} wrap={false}>
              <Text style={styles.skillCategoryTitle}>{category.title}</Text>
              <View style={styles.skillList}>
                {category.skills.map((skill: any) => (<Text key={skill.id} style={styles.skillItem}>{skill.name}</Text>))}
              </View>
            </View>
          ))}
        </View>

        {/* Languages Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.skillList}>
            {languages?.map((lang: any, i: number) => (
              <View key={i} style={styles.languageItem}>
                <Text style={styles.languageName}>{lang.lang}</Text>
                <Text style={styles.languageLevel}>{lang.level}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplate;