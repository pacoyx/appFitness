import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.TrainingState>) {

    }

    fetchAvailableExercises() {
        this.fbSubs.push(this.db.collection('availableExercises')
            .snapshotChanges()
            .pipe(
                map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data() as Exercise;
                        data.id = a.payload.doc.id;
                        return data;
                    });
                })

            ).subscribe((result: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTraining(result));
                // this.uiService.loadindStateChanged.next(false);
                // this.availableExercises = result;
                // this.exercisesChanged.next([...this.availableExercises]);
            }, error => {
                this.uiService.loadindStateChanged.next(false);
                this.uiService.showSnackbar('Fetching exercises failed', null, 3000);
            }));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() })
        // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        // this.exerciseChanged.next({ ...this.runningExercise });
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise(): void {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToBase({
                ...ex,
                date: new Date(),
                state: 'complete'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number): void {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToBase({
                ...ex,
                date: new Date(),
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db
                .collection('finishedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    // this.finishedExercisesChanged.next(exercises);
                    this.store.dispatch(new Training.SetFinishedTraining(exercises));
                }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToBase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

}
