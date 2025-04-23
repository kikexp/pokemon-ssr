import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {
  public isLoading = signal(true);

  public pokemons = signal<SimplePokemon[]>([]);

  private appRef = inject(ApplicationRef);

  private pokemonsServices = inject(PokemonsService);

  private route = inject(ActivatedRoute);
  private router = inject(Router)

  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page)) // Ensure page is at least 1
    )
  );
  // private $appState = this.appRef.isStable.subscribe((isStable) => {

  //   console.log({isStable});
  // })

  // ngOnDestroy(): void {
  //   //Called once, before the instance is destroyed.
  //   //Add 'implements OnDestroy' to the class.
  //   this.$appState.unsubscribe();
  // }
  ngOnInit(): void {
    this.loadPokemons();

    console.log(this.currentPage());
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000);
  }

  public loadPokemons(page: number = 0) {
    console.log()
    const pageToLoad = this.currentPage()! + page;
    this.pokemonsServices.loadPage(pageToLoad)
    .pipe(
      tap(() => {
        this.router.navigate([], {queryParams: { page: pageToLoad}})
        this.title.setTitle(`Pokemnos ssr - Page ${pageToLoad}` )
      })
    )
    .subscribe((pokemons) => {
      this.pokemons.set(pokemons);
      this.isLoading.set(false);
      // this.appRef.tick();
    });
  }
}
