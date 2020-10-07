register(function (question, customQuestionSettings, questionViewSettings) {

  var gauge = {

    q: question,
    qid: question.id,
    qSel: "#" + question.id,

    Render: function() {
      $('<div class="cf-question__text">' + this.q.text + '</div>').appendTo(this.qSel);
      $('<div class="cf-question__instruction">' + this.q.instruction + '</div>').appendTo(this.qSel);
      $('<div class="cf-question__content" style="min-height:200px"><div class="custom-question--gauge"><div id="semi1_' + this.qid + '" class="custom-question--gauge__semicircle custom-question--gauge__semicircle--in-motion-1"></div><div id="semi2_' + this.qid + '" class="custom-question--gauge__semicircle custom-question--gauge__semicircle--in-motion-2"></div><div id="semi3_' + this.qid + '" class="custom-question--gauge__semicircle custom-question--gauge__semicircle--fixed"></div><div class="custom-question--gauge__inner-area"><p id="indicator_' + this.qid + '" class="custom-question--gauge__label"></p></div></div></div>').appendTo(this.qSel);
      $('.custom-question--gauge__semicircle--in-motion-1, .custom-question--gauge__semicircle--in-motion-2').css('background-color', customQuestionSettings.dialColor);
      $('.custom-question--gauge__label').css('color', customQuestionSettings.labelColor);
    },

    onGaugeChange: function(answer) {
      this.q.setValue(answer);
    },

    SetIncrease: function() {
      var one = document.getElementById("semi1_" + this.qid);
      var two = document.getElementById("semi2_" + this.qid);
      var fixed = document.getElementById("semi3_" + this.qid);
      var indicator = document.getElementById("indicator_" + this.qid);
      var r1 = this._GetRotation(one);
      var r2 = this._GetRotation(two);
      if( r1 != 180 ) {
        r1 = parseInt(r1) + this._GetRotationIncrement();
        var percent = this._ComputePercent(r1);
        r1 = "rotate(" + r1 + "deg)";
        one.style.transform = r1;
        two.style.transform = r1;
      }
      else if( r1 == 180 && r2 != 360 ) {
        r2 = parseInt(r2) + this._GetRotationIncrement();
        var percent = this._ComputePercent(r2);
        r2 = "rotate(" + r2 + "deg)";
        two.style.transform = r2;
        two.style.zIndex = "3";
        fixed.style.zIndex = "2";
      }
      if(percent) {
        indicator.innerHTML = percent + "%";
        this.onGaugeChange(percent);
      }
    },
    SetDecrease: function() {
      var one = document.getElementById("semi1_" + this.qid);
      var two = document.getElementById("semi2_" + this.qid);
      var fixed = document.getElementById("semi3_" + this.qid);
      var indicator = document.getElementById("indicator_" + this.qid);
      var r1 = this._GetRotation(one);
      var r2 = this._GetRotation(two);
      if( r2 == 180 ) {
        two.style.zIndex = "2";
        fixed.style.zIndex = "3";
      }
      if( r2 != 0 && r2 <= 180) {
        r2 = parseInt(r2) - this._GetRotationIncrement();
        var percent = this._ComputePercent(r2);
        r2 = "rotate(" + r2 + "deg)";
        one.style.transform = r2;
        two.style.transform = r2;
      }
      else if( r2 > 180 ) {
        r2 = parseInt(r2) - this._GetRotationIncrement();
        var percent = this._ComputePercent(r2);
        r2 = "rotate(" + r2 + "deg)";
        two.style.transform = r2;
      }
      if(percent) {
        indicator.innerHTML = percent + "%";
        this.onGaugeChange(percent);
      }
    },
    _GetRotation: function(elem) {
      var x = elem.style.transform;
      return x ? x.split("(")[1].split("deg")[0] : 0;
    },
    _ComputePercent: function(rot) {
      return Math.round(rot / 360 * 100);
    },
    _GetRotationIncrement: function() {
      return Math.round(360 / (100 / parseInt(customQuestionSettings.incrementAmount)));
    }
  }

  gauge.Render();//wanted to create an object off of currentQuestion and use OLOO
  document.body.onkeyup = function(event) {
    if(event.which == 38 || event.which == 39) {
      gauge.SetIncrease();
    }
    else if(event.which == 37 || event.which == 40) {
      gauge.SetDecrease();
    }
  };
});
