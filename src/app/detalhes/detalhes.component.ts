import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceRequisicao } from '../app.service';
import { Post } from '../model';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent {

  @Input() dados: Post[] = [];
  @Input() paginatedData: Post[] = [];
  detalhes: Post | undefined;
  postId: number | undefined; // Corrigir o tipo para 'number'

  constructor(
    private route: ActivatedRoute,
    private service: ServiceRequisicao
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = Number(params['id']); // Armazenar o valor do ID na propriedade this.postId
      this.detalhes = this.paginatedData.find(post => post.id === this.postId);
    });
  }
}
