import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import PerfAccordionContainer from './container/container';
import { generateSections } from './accordion-perf-utils';

const measureName = 'accordion-1-singleSection-50-sections';

// eslint-disable-next-line no-undef
measure(measureName, 1, benchmark, run, (tag, run) => {
    const elements = [];
    const accordion = {
        activeSectionName: 'acc-1-section-10', // section 10 is open
        allowMultipleSectionsOpen: false,
        sections: generateSections(50, 'acc-1'),
    };

    run('create', (i) => {
        const element = createElement(tag, { is: PerfAccordionContainer });
        Object.assign(element, accordion);

        elements[i] = element;
    });

    run('append', (i) => {
        main.appendChild(elements[i]);
    });

    run('update - open a section', (i) => {
        elements[i].activeSectionName = 'acc-1-section-30';
    });

    run('remove', (i) => {
        main.removeChild(elements[i]);
    });
});
