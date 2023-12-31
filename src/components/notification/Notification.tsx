import React, {useEffect} from "react";

interface NotificationProps {
    show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ show }) => {

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (show) {
            timer = setTimeout(() => {
                clearTimeout(timer);
            }, 5000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [show]);

    console.log(show)

    return (
        <div>
            {show ? (
                <div
                    className="fixed right-1 border border-slate-400 top-4 transform transition-transform duration-300 ease-in-out translate-y-0 opacity-100 translate-y-full opacity-0">
                    <div className="bg-slate-100 p-7 shadow-lg flex items-center space-x-2">
        <span className="text-3xl">
          <i className="bx bx-check"/>
        </span>
                        <p className="font-bold">Post Created Successfully!</p>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default Notification;
