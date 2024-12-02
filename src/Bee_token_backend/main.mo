import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor {
  var principal = "2ad5n-kxux5-kjg4s-mej57-pbp7c-7deup-npnb3-nawd6-ehghd-mvdo6-dae";

  let owner : Principal = Principal.fromText(principal);
  let totalSupply : Nat = 1000000000;
  let symbol : Text = "BEE";

  private stable var balanceEntries : [(Principal, Nat)] = [];

  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

  if (balances.size() < 1) {
    balances.put(owner, totalSupply);
  };

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };

    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  public shared (msg) func payOut(amount: Nat) : async Text {
    // Debug.print(debug_show (msg.caller));
    if (balances.get(msg.caller) == null) {
      let result = await transfer(msg.caller, amount);
      return result;
    } else {
      return "Already Claimed";
    };
  };

  public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
    Debug.print(debug_show (msg.caller));
    let fromBalance = await balanceOf(msg.caller);
    if (fromBalance >= amount) {
      let newBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newBalance);

      let toBalance = await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);
      return "Success";
    } else {
      return "Insufficient Funds";
    };
  };

  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if (balances.size() < 1) {
      balances.put(owner, totalSupply);
    };
  };
};
