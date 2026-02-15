export const state = {
    currentYear: new Date().getFullYear(),
    pageIndex: 0, // 0 = Jan-Feb, 1 = Mar-Apr, ... 5 = Nov-Dec
    customImage: null // Stores Data URL of uploaded image
};