import { HttpClient } from '@angular/common/http';
import { PublicUserResultClass } from './public-user-result';
import { MatchListItem, MatchQueryInfo } from 'common/models/matching';

export class MatchListItemClass extends PublicUserResultClass {
    queryInfo: MatchQueryInfo;

    constructor(initialValue: MatchListItem, http: HttpClient) {
        super(initialValue, http);
        this.queryInfo = initialValue;
    }
}
