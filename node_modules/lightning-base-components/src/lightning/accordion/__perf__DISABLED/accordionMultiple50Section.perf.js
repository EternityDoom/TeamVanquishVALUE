import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import PerfAccordionContainer from './container/container';
import { generateSections, getSectionNames } from './accordion-perf-utils';

const measureName = 'accordion-1-multipleSection-50-sections';

// eslint-disable-next-line no-undef
measure(measureName, 1, benchmark, run, (tag, run) => {
    const elements = [];
    const accordion = {
        activeSectionName: getSectionNames({
            ownerAccordionId: 'acc-1',
            firstSectionId: 0,
            sectionIdIncrement: 2,
            maxSectionId: 50,
        }),
        allowMultipleSectionsOpen: true,
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

    run('update - open/close a section', (i) => {
        elements[i].activeSectionName = getSectionNames({
            ownerAccordionId: 'acc-1',
            firstSectionId: 1,
            sectionIdIncrement: 2,
            maxSectionId: 50,
        });
    });

    run('remove', (i) => {
        main.removeChild(elements[i]);
    });
});
