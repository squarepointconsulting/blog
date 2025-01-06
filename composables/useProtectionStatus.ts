export const useProtectionSection = () => {
    const checkSectionExists = (home: any, sectionId: string) => {
        const path = sectionId.split('.')
        let current = home
        
        for (const key of path) {
            if (!current || typeof current !== 'object') return false
            current = current[key]
        }
        
        return current !== undefined && current !== null
    }

    return {
        checkSectionExists
    }
}