import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscriptions = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscriptions.unsubscribe();
    });
  }
  onSelectPlace(selectedPlace: Place) {
    const subscriptions = this.placesService
      .addPlaceToUserPlaces(selectedPlace)
      .subscribe({
        next: (resData) => console.log(resData),
      });
    this.destroyRef.onDestroy(() => {
      subscriptions.unsubscribe();
    });
  }
}
