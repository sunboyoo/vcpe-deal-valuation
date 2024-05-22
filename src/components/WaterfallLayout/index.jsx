import React from 'react';

const sections = [
    { id: 1, color: 'white', text: 'Section 1' },
    { id: 2, color: 'rgb(247, 249, 252)', text: 'Section 2' },
    { id: 3, color: 'rgb(250,250,250)', text: 'Section 3' },

];

const sectionStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '2em',
};

const Section = ({ color, text }) => (
    <div style={{ ...sectionStyle, backgroundColor: color }}>
        {text}
    </div>
);

const App = () => (
    <div style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        {sections.map(section => (
            <Section key={section.id} color={section.color} text={section.text} />
        ))}
    </div>
);

export default App;
