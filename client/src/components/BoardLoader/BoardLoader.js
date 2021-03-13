import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import UsersList from "../UserList/UsersList";
import { Droppable } from "react-beautiful-dnd";
import ComponentAction from "../ComponentAction/ComponentAction";

export default function BoardLoader() {
    const skeletonColor = "#eaeaea";
    const todoListColor = "rgba(210,210,210,0.4)";
    const todoListStyle = {
        width: 22.9 + "%",
        marginRight: 2 + ".1%",
    };

    return (
        <>
            <div className="board-header border-bottom d-flex justify-content-center pt-2 pb-2 shadow">
                <div className="col-11 col-md-8 col-lg-11 d-flex justify-content-between">
                    <div className="board-header-title d-flex align-items-center">
                        <h5 className="text-dark">
                            <SkeletonTheme color={skeletonColor}>
                                <Skeleton width={220} />
                            </SkeletonTheme>
                        </h5>
                        <span className="ms-2 badge bg-secondary p-2"></span>
                    </div>
                    <div className="board-header-info d-flex align-items-center">
                        <div className="h-100 vertical-dec m-3"></div>
                        <SkeletonTheme color={skeletonColor}>
                            <Skeleton width={120} height={30} />
                        </SkeletonTheme>
                    </div>
                </div>
            </div>
            <div className="mt-4 d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-11">
                    <SkeletonTheme color={todoListColor}>
                        <Skeleton height={35} style={{ width: 100 + "%" }} />
                    </SkeletonTheme>
                </div>
            </div>
            <div className="mt-4 d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-11">
                    <SkeletonTheme color={todoListColor}>
                        <Skeleton height={400} style={todoListStyle}></Skeleton>
                        <Skeleton height={400} style={todoListStyle}></Skeleton>
                        <Skeleton height={400} style={todoListStyle}></Skeleton>
                        <Skeleton height={400} style={todoListStyle}></Skeleton>
                    </SkeletonTheme>
                </div>
            </div>
        </>
    );
}
