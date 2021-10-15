/**
 * Generates N Sections belonging to the ownerAccordionId.
 *
 * @param {Integer} n - The number of sections to generate
 * @param {String} ownerAccordionId - The owner accordion of these sections (the section name will be prefixed with it)
 * @return {Array} The generated sections.
 */
export function generateSections(n, ownerAccordionId) {
    const result = [];

    for (let i = 0; i < n; i++) {
        result.push({
            name: `${ownerAccordionId}-section-${i}`,
            label: `${ownerAccordionId}-label-for-section-${i}`,
            content: `${ownerAccordionId}-content-${i} Content paragraph`,
        });
    }

    return result;
}

/**
 * Gets an array of section names belonging to ownerAccordionId accordion.
 *
 * @param {String} ownerAccordionId - the owner accordion id.
 * @param {Integer} firstSectionId - Start getting names from $firstSectionId section.
 * @param {Integer} sectionIdIncrement - The gap between sections (sectionIdIncrement - 1)
 * @param {Integer} maxSectionId - The max sectionId that is allowed to be returned
 * @return {Array} The sections names satisfying the above constrains.
 */
export function getSectionNames({
    ownerAccordionId,
    firstSectionId,
    sectionIdIncrement,
    maxSectionId,
}) {
    const result = [];

    for (let i = firstSectionId; i < maxSectionId; i += sectionIdIncrement) {
        result.push(`${ownerAccordionId}-section-${i}`);
    }

    return result;
}

/**
 * Generates N accordions data. Each one with the following:
 *      - activeSectionName: For accordion i, the open section is i. Ex: acc-2 has open the section 2 (acc-2-section-2)
 *      - sections: An array of sections containing nSections.
 *      - allowMultipleSectionsOpen: true or false according allowMultipleSectionsOpen.
 *
 * @param {Integer} numberOfAccordions - number of accordions to generate (0..N-1)
 * @param {Integer} numberOfSectionsPerAccordion - number of sections to generate for each accordion.
 * @param {Boolean} [allowMultipleSectionsOpen=false] - whether or not the accordions allow multiple sections open at one time.
 * @return {Array} - The generated accordions.
 */
export function generateAccordions({
    numberOfAccordions,
    numberOfSectionsPerAccordion,
    allowMultipleSectionsOpen = false,
}) {
    const results = [];

    for (let i = 0; i < numberOfAccordions; i++) {
        results.push({
            activeSectionName: `acc-${i}-section-${i}`,
            allowMultipleSectionsOpen,
            sections: generateSections(
                numberOfSectionsPerAccordion,
                'acc-' + i
            ),
        });
    }

    return results;
}
