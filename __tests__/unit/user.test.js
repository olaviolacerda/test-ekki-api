const { User } = require('../../server/models');
const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a user', async () => {
    const user = await User.create({
      name: 'Olavio',
      cpf: '00000000000',
      phone: '123456789',
    });

    expect(user).toMatchObject({
      name: 'Olavio',
      cpf: '00000000000',
      phone: '123456789',
    });
  });
});
