import { Component ,OnInit} from '@angular/core';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  list=faList;
  cart=faCartShopping;
  searchResult:undefined | product[];

  constructor(private activeRoute:ActivatedRoute ,private product:ProductService){}

  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query');
    console.warn(query);
    query && this.product.searchProducts(query).subscribe((result)=>{
      this.searchResult=result;
    })
  }

}
