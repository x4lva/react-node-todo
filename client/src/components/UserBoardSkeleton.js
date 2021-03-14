import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function UserBoardSkeleton() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
