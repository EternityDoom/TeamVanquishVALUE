import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import PerfAccordionContainer from './container/container';
import { generateAccordions, getSectionNames } from './accordion-perf-utils';

const measureName = 'accordion-10-multiple-25-sections-each';

// eslint-disable-next-line no-undef
measure(measureName, 10, benchmark, run, (tag, run) => {
    const elements = [];
    const accordions = generateAccordions({
        numberOfAccordions: 10,
        numberOfSectionsPerAccordion: 25,
        allowMultipleSectionsOpen: true,
    });

    // we need to rewrite the open sections
    for (let i = 0, n = accordions.length; i < n; i++) {
        accordions[i].activeSectionName = getSectionNames({
            ownerAccordionId: 'acc-' + i,
            firstSectionId: 0,
            sectionIdIncrement: 2,
            maxSectionId: 25,
        });
    }

    // lets store the new values for sections in the update
    const openUpdates = [];

    for (let i = 0, n = accordions.length; i < n; i++) {
        openUpdates[i] = getSectionNames({
            ownerAccordionId: 'acc-' + i,
            firstSectionId: 1,
            sectionIdIncrement: 2,
            maxSectionId: 25,
        });
    }

    run('create', (i) => {
        const element = createElement(tag, { is: PerfAccordionContainer });
        Object.assign(element, accordions[i]);

        elements[i] = element;
    });

    run('append', (i) => {
        main.appendChild(elements[i]);
    });

    run('update - open a section', (i) => {
        elements[i].activeSectionName = openUpdates[i];
    });

    run('remove', (i) => {
        main.removeChild(elements[i]);
    });
});
