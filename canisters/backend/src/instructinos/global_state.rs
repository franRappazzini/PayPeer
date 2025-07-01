use crate::states::GlobalState;

impl GlobalState {
    pub fn init(&mut self) {
        self.authorities.insert(ic_cdk::caller(), ());
    }
}
