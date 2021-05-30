import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { Exercise } from './exercise.model';
import { SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING, TrainingActions } from './training.actions';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
    avaiableExercises: Exercise[];
    finishExercises: Exercise[];
    activeTraining: Exercise;
}

export interface State extends fromRoot.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    avaiableExercises: [],
    finishExercises: [],
    activeTraining: null,
}

export function trainingReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return { ...state, avaiableExercises: action.payload };
        case SET_FINISHED_TRAININGS:
            return { ...state, finishExercises: action.payload };
        case START_TRAINING:
            return { ...state, activeTraining: state.avaiableExercises.find(ex => ex.id === action.payload) };
        case STOP_TRAINING:
            return { ...state, activeTraining: null };

        default:
            return state;
    }
}
export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvilableExercises = createSelector(getTrainingState, (state: TrainingState) => state.avaiableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);

export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);