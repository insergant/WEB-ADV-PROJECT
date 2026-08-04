import { translations } from './Components/translations';

// The old default Create-React-App test looked for a "learn react" link that no
// longer exists, so `npm test` failed outright. This replaces it with a small,
// deterministic check that also guards against translation drift.

test('all languages expose the same set of translation keys', () => {
  const langs = Object.keys(translations); // ['en','fr','ar']
  expect(langs).toContain('en');

  const enKeys = Object.keys(translations.en).sort();
  langs.forEach((lang) => {
    const keys = Object.keys(translations[lang]).sort();
    expect(keys).toEqual(enKeys);
  });
});

test('key contact + navigation keys are present in English', () => {
  ['contactUs', 'fullName', 'sendMessage', 'adminPanel', 'leaderPortal'].forEach((k) => {
    expect(translations.en[k]).toBeTruthy();
  });
});
