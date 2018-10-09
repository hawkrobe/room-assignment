import React from "react";
import EventLog from "./EventLog";
import ChatLog from "./ChatLog";

export default class SocialInteractions extends React.Component {
  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="image">
          <span
            className={`satisfied pt-tag pt-round ${
              player.get("satisfied") ? "pt-intent-success" : "pt-intent-danger"
            }`}
          >
            <span
              className={`pt-icon-standard ${
                player.get("satisfied") ? "pt-icon-tick" : "pt-icon-cross"
              }`}
            />
          </span>

          <img src={player.get("avatar")} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

  render() {
    const { game, stage, player } = this.props;

    const otherPlayers = _.reject(game.players, p => p._id === player._id);
    console.log("otherPlayers", otherPlayers);
    console.log("chat", stage.get("chat"));
    console.log("log", stage.get("log"));
    const messages = stage.get("chat").map(({ text, playerId }) => ({
      text,
      subject: game.players.find(p => p._id === playerId)
    }));
    const events = stage.get("log").map(({ subjectId, ...rest }) => ({
      subject: subjectId && game.players.find(p => p._id === subjectId),
      ...rest
    }));

    return (
      <div className="social-interactions">
        <div className="status">
          <div className="players pt-card">
            {this.renderPlayer(player, true)}
            {otherPlayers.map(p => this.renderPlayer(p))}
          </div>

          <div className="total-score pt-card">
            <h6>Total Score</h6>

            <h2>{game.get("cumulativeScore") || 0}</h2>
          </div>
        </div>

        <EventLog events={events} stage={stage} player={player} />
        <ChatLog messages={messages} stage={stage} player={player} />
      </div>
    );
  }
}
