test('Private window.store should be undefined before we access window.store', () => {
    expect(window.store).toBeUndefined();
});
