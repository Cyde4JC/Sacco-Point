/* eslint-disable import/no-cycle */

import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { dispatch } from '../store';
// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    withdrawalApproved: false,
    transactionSuccessful: false,
    fetchProductsSuccessful: false,
    error: null,
    groups: [],
    products: {
        count: 0,
        pages: 0,
        current_page: 0,
        data: []
    },
    createProductSuccessful: false,
    applicationSuccessful: false,
    group: null,
    trackerTab: 'members',
    participantTransactions: [],
    transactions: {
        count: 0,
        pages: 0,
        current_page: 0,
        data: []
    },
    loans: {
        count: 0,
        pages: 0,
        current_page: 0,
        data: []
    },
    fetchedLoans: false,
    approvals: [],
    info: '',
    product: {}
};

const slice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
            state.error = null;
            state.info = null;
        },
        // RESET
        resetGroupCreationObjects(state, action) {
            state.isLoading = false;
            state.error = null;
            state.group = null;
        },
        // RESET
        resetNotices(state, action) {
            state.error = null;
            state.info = null;
        },
        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // GET GROUPS SSUCCESS
        getGroupsSuccess(state, action) {
            const groups = action.payload;
            state.error = null;
            state.group = null;
            state.isLoading = false;
            state.groups = groups;
        },

        // GET GROUPS SSUCCESS
        getTransactionsSuccess(state, action) {
            const transactions = action.payload;
            state.isLoading = false;
            state.transactions = transactions;
        },

        // GET APPROVALS SSUCCESS
        getApprovalsSuccess(state, action) {
            const approvals = action.payload;
            state.isLoading = false;
            state.approvals = approvals;
        },

        // PROCESS SSUCCESS
        processedApprovalSuccessully(state, action) {
            state.withdrawalApproved = true;
            state.info = 'Withdrawal Approved Successfully.';
        },

        processedLoanSuccessully(state, action) {
            state.withdrawalApproved = true;
            state.info = 'Transaction Approved Successfully.';
        },


        // GET GROUP SSUCCESS
        getGroupSuccess(state, action) {
            const group = action.payload;
            state.isLoading = false;
            state.group = group;
        },



        // CREATE GROUPS SSUCCESS
        createGroupSuccess(state, action) {
            const group = action.payload;
            state.isLoading = false;
            state.group = group;
            state.info = `${group.name} created successfully.`
        },

        // CREATE GROUPS SSUCCESS
        addGroupMemberSuccess(state, action) {
            const group = action.payload;

            state.isLoading = false;
            state.group = group;
        },

        // MEMBER TRXs SSUCCESS
        getMemberGroupTransactionsSuccess(state, action) {
            const participantTransactions = action.payload;

            state.isLoading = false;
            state.participantTransactions = participantTransactions;
        },

        // GET PARTICIPANTS
        getParticipantsSuccess(state, action) {
            const participants = action.payload;
            state.participants = participants;
            state.isLoading = false;
        },
        // SELECT GRP
        groupSelection(state, action) {
            const group = action.payload;
            state.group = group;
        },

        onTrackerTabChange(state, action) {
            const trackerTab = action.payload;
            state.trackerTab = trackerTab;
        },
        onTransactionSuccessful(state, action) {
            state.transactionSuccessful = true;
            state.info = action.payload
        },
        createProductSuccessful(state, action) {
            state.createProductSuccessful = true;
            state.isLoading = false;
            state.product = action.payload
            state.info = 'Product created successfully.'
        },
        fetchProductSuccessful(state, action) {
            state.fetchProductsSuccessful = true;
            state.createProductSuccessful = false;
            state.applicationSuccessful = false
            state.isLoading = false;
            state.products = action.payload
            state.info = 'Products retrieved successfully.'
        },

        fetchLoansSuccessful(state, action) {
            state.fetchedLoans = true;
            state.applicationSuccessful = false
            state.isLoading = false;
            state.loans = action.payload
            state.info = 'Loans retrieved successfully.'
        },
        applyGroupLoanSuccess(state, action) {
            state.applicationSuccessful = true;
            state.isLoading = false;
            // state.loans = action.payload
            state.info = 'Loan applied successfully.'
        }
    },
});

// Reducer
export default slice.reducer;

// Actions
export const { groupSelection, resetNotices, onTrackerTabChange } = slice.actions;

// ----------------------------------------------------------------------
// FUNCTIONS

// {{BASE_URL}}/groups/group-info/?page=1&page_size=1

export async function applyLoan(payload) {
    try {
        dispatch(slice.actions.startLoading());
        const response = await axios.post(`/loans/`, payload);

        if (response.data.status) {
            dispatch(slice.actions.applyGroupLoanSuccess(response.data));
        } else {
            dispatch(slice.actions.hasError(response.data.message));
        }

    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        dispatch(slice.actions.hasError(error.message));
    }
}
