import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import PerfAccordionContainer from './container/container';
import { generateAccordions } from './accordion-perf-utils';

const measureName = 'accordion-10-single-25-sections-each';

// eslint-disable-next-line no-undef
measure(measureName, 10, benchmark, run, (tag, run) => {
    const elements = [];
    const accordions = generateAccordions({
        numberOfAccordions: 10,
        numberOfSectionsPerAccordion: 25,
        allowMultipleSectionsOpen: false,
    });

    run('create', (i) => {
        const element = createElement(tag, { is: PerfAccordionContainer });
        Object.assign(element, accordions[i]);

        elements[i] = element;
    });

    run('append', (i) => {
        main.appendChild(elements[i]);
    });

    run('update - open a section', (i) => {
        // section 20 is always closed given that in the accordion i the open section is i,
        // and we only have 10 accordions with 25 sections each
        elements[i].activeSectionName = 'acc-' + i + '-section-20';
    });

    run('remove', (i) => {
        main.removeChild(elements[i]);
    });
});
