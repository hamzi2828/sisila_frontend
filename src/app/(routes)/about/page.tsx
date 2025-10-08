import AboutHeroStats from './components/AboutHeroStats';
import AboutPillars from './components/AboutPillars';
import AboutJourneyValues from './components/AboutJourneyValues';
import AboutPressTeamCTA from './components/AboutPressTeamCTA';

export const metadata = {
  title: 'About Silsila',
  description:
    'Silsila merges cultural heritage with contemporary fashion — themes, series, and craft shaped for modern expression.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroStats />
      <AboutPillars />
      <AboutJourneyValues />
      <AboutPressTeamCTA />
    </>
  );
}