import { CochevisPage } from './app.po';

describe('cochevis App', () => {
  let page: CochevisPage;

  beforeEach(() => {
    page = new CochevisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
