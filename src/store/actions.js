export const ADD_PLANLIST = 'ADD_PLANLIST'
export const DELETE_PLANLIST = 'DELETE_PLANLIST'
export const CLEAR_PLANLIST = 'CLEAR_PLANLIST'
export const ADD_COUPON = 'ADD_COUPON'
export const DELETE_COUPON = 'DELETE_COUPON'
export const CLEAR_COUPON = 'CLEAR_COUPON'

export const addPlanList = (planDec) => {
    return {
        type: ADD_PLANLIST,
        payload: planDec
    };
}

export const delPlanList = (planIndex) => {
    return {
        type: DELETE_PLANLIST,
        payload: planIndex,
    };
}

export const clearPlanList = () => {
    return {
        type: CLEAR_PLANLIST,
    };
}

export const addCoupon = (couponDec) => {
    return {
        type: ADD_COUPON,
        payload: couponDec
    };
}

export const delCoupon = (couponIndex) => {
    return {
        type: DELETE_COUPON,
        payload: couponIndex
    };
}

export const clearCoupon = () => {
    return {
        type: CLEAR_COUPON,
    };
}