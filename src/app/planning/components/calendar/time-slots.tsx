

function WeeklyTimeSlots(
    { viewType }: { viewType: 'monthly' | 'weekly' }
) {
    if (viewType !== 'weekly') return null;
    
    return (
        <div className="time-slots">
            {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="time-slot">
                    {i}:00
                </div>
            ))}
        </div>
    );
}

function TimeSlotsOverlay({
    viewType, globalSlotsHeight
} : {
    viewType: 'monthly' | 'weekly',
    globalSlotsHeight: number
}) {
    if (viewType !== 'weekly') return null;

    return (
        Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="time-slot-overlay" 
                style={{
                    top: `calc(50px + ${i*globalSlotsHeight}px)`,
                }}>
            </div>
        ))
    )
}



export { WeeklyTimeSlots, TimeSlotsOverlay };