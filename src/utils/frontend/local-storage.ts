export const setLocalStorage = (key: string, value: string) => {
    if (typeof window !== "undefined") {
        console.log("WORKED")
        localStorage.setItem(key, value);
    } else {
        console.log("DID NOT WORK")
    }
};
  
export const getLocalStorage = (key: string): string | null => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(key);
        console.log(value)
        return value ? value : null;
    } else {
        console.log("NO VALUE")
    }
    return null;
};

export const removeLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};