// Tweaks island for the timeline blog — applies values to <html> via CSS vars / data-attrs.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "accent": "#2f6df0",
  "headingFont": "Space Grotesk",
  "bodyFont": "Newsreader",
  "images": "spacious",
  "categoryColors": true
}/*EDITMODE-END*/;

const FONT_STACK = {
  "Space Grotesk": "'Space Grotesk',system-ui,sans-serif",
  "Newsreader": "'Newsreader',Georgia,serif",
  "Space Mono": "'Space Mono',ui-monospace,monospace",
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.theme;
    r.dataset.images = t.images;
    r.dataset.cat = t.categoryColors ? 'on' : 'off';
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-ink', t.accent);
    r.style.setProperty('--font-head', FONT_STACK[t.headingFont] || FONT_STACK['Space Grotesk']);
    r.style.setProperty('--font-body', FONT_STACK[t.bodyFont] || FONT_STACK['Newsreader']);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" value={t.theme}
                  options={[{value:'paper',label:'Paper'},{value:'sepia',label:'Sepia'},{value:'dark',label:'Dark'}]}
                  onChange={(v) => setTweak('theme', v)} />
      <TweakColor label="Accent" value={t.accent}
                  options={['#2f6df0', '#e2604a', '#2f9e6b', '#7a5cf0']}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakToggle label="Category colours" value={t.categoryColors}
                   onChange={(v) => setTweak('categoryColors', v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Headings" value={t.headingFont}
                   options={['Space Grotesk', 'Newsreader', 'Space Mono']}
                   onChange={(v) => setTweak('headingFont', v)} />
      <TweakSelect label="Body" value={t.bodyFont}
                   options={['Newsreader', 'Space Grotesk']}
                   onChange={(v) => setTweak('bodyFont', v)} />

      <TweakSection label="Layout" />
      <TweakRadio label="Image size" value={t.images}
                  options={[{value:'cozy',label:'Cozy'},{value:'spacious',label:'Spacious'}]}
                  onChange={(v) => setTweak('images', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
