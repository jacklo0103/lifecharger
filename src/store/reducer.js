import {ADD_PLANLIST, DELETE_PLANLIST, CLEAR_PLANLIST, 
        ADD_COUPON, DELETE_COUPON, CLEAR_COUPON
        } from './actions';

const initState = {
    planList: [],
    couponList: []
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case ADD_PLANLIST: {
            const tempPlan = [...state.planList];
            tempPlan.push(action.payload);
            return {
                ...state,
                planList: tempPlan,
            }
        }
        case DELETE_PLANLIST: {
            const tempPlan = [...state.planList];
            tempPlan.splice(action.payload, 1);
            return {
                ...state,
                planList: tempPlan,
            }
        }
        case CLEAR_PLANLIST: {
            const tempPlan = [];
            return {
                ...state,
                planList: tempPlan,
            }
        }
        case ADD_COUPON: {
            const tempPlan = [...state.couponList];
            tempPlan.push(action.payload);
            return {
                ...state,
                couponList: tempPlan,
            }
        }
        case DELETE_COUPON: {
            const tempPlan = [...state.couponList];
            tempPlan.splice(action.payload, 1);
            return {
                ...state,
                couponList: tempPlan,
            }
        }
        case CLEAR_COUPON: {
            const tempPlan = [];
            return {
                ...state,
                couponList: tempPlan,
            }
        }
        default:
            return state;
    }
};

export default reducer;