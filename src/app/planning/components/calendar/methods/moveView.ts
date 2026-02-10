
interface MoveViewParams {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    viewType: 'monthly' | 'weekly';
    year: number;
    month: number;
}

export const moveView = {
    goToNextMonth : ({
        currentDate, setCurrentDate, viewType, year, month
    } : MoveViewParams) => {
        if (viewType === 'weekly') {
            const nextWeekDate = new Date(currentDate);
            nextWeekDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(nextWeekDate);
            return;
        }
        setCurrentDate(new Date(year, month, 1));
    },
    goToPreviousMonth : ({
        currentDate, setCurrentDate, viewType, year, month
    } : MoveViewParams) => {
        if (viewType === 'weekly') {
            const previousWeekDate = new Date(currentDate);
            previousWeekDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(previousWeekDate);
            return;
        }
        setCurrentDate(new Date(year, month - 2, 1));
    }
}