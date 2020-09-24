var app = new Vue({
    el: '#app',
    data: {
        clubs: [],
        clubSelected: '',
        startDate: '',
        endDate: '',
        isLoading: false,
        data: null,
    },
    computed: {
        report() {
            if (this.data === null) {
                return null;
            }

            const d = this.data;
            const name = this.clubSelected.substring(0, this.clubSelected.length - 5);

            return [
                `No período de ${this.startDate} a ${this.endDate}, o ${name} jogou ${d['matches']} partidas, disputando ${d['matches'] * 3} pontos e conquistando ${d['points']}, o que resulta num rendimento de ${(d['points'] / (d['matches'] * 3) * 100).toFixed(0)}%`,
                `Desses jogos, ${d['matches-home']} foram disputados em casa, nos quais obteve ${d['points-home']} pontos, ou seja, um aproveitamento de ${(d['points-home'] / (d['matches-home'] * 3) * 100).toFixed(0)}% em casa. Fora de casa foram ${d['matches-away']} partidas e ${d['points-away']} pontos, ou ${(d['points-away'] / (d['matches-away'] * 3) * 100).toFixed(0)}% de aproveitamento longe do seu estádio.`,
                `Os ${d['points']} pontos conquistados vieram em ${d['victories']} vitórias e ${d['ties']} empates. Considerando apenas os jogos em que pontuou, ${(d['ties'] / (d['ties'] + d['victories']) * 100).toFixed(0)}% foram empate. Isso representa ${(d['ties'] / (d['points']) * 100).toFixed(0)}% dos pontos totais conquistados.`,
                `Das ${d['victories']} vitórias, ${(d['victory-1-goal'] / d['victories'] * 100).toFixed(0)}% aconteceram com um único gol de diferença, enquanto ${(d['victory-2-goals'] / d['victories'] * 100).toFixed(0)}% vieram com dois gols de diferença e ${(d['victory-many-goals'] / d['victories'] * 100).toFixed(0)}% foram de goleada.`,
            ]
        },
        canSearch() {
            const pattern = /^\d\d\/\d\d\/\d{4}$/;

            return (
                this.clubSelected !== '' &&
                pattern.test(this.startDate) &&
                pattern.test(this.endDate)
            );
        },
        buttonSearchClass() {
            return [ 'button', 'is-primary', this.isLoading ? 'is-loading' : '' ];
        },
        controlInputClass() {
            return [ 'control', 'has-icons-left', 'is-fullwidth', 'is-loading' ? this.isLoading : '' ];
        },
    },
    methods: {
        search() {
            this.isLoading = true;
            this.data = null;

            const startDate = this.startDate.split('/').reverse().join('-');
            const endDate = this.endDate.split('/').reverse().join('-');
            const name = this.clubSelected;

            fetch(`https://f4vvxlct29.execute-api.us-east-1.amazonaws.com/dev/relatorio?start-date=${startDate}&end-date=${endDate}&team=${name}`)
                .then(res => res.json())
                .then(data => {
                    this.isLoading = false;
                    if (data.erro) {
                        alert(data.erro);
                    } else {
                        this.data = data;
                    }
                }).catch(err => {
                    this.isLoading = false;
                    alert(err);
                })
        },
        startApp() {
            fetch('https://f4vvxlct29.execute-api.us-east-1.amazonaws.com/dev/nomes')
                .then(res => res.json())
                .then(clubs => {
                    document.getElementById('dumb-loading').classList.add('is-hidden');
                    document.getElementById('app').classList.remove('is-hidden');
                    this.clubs = clubs;
                }).catch(err => {
                    alert(err);
                    alert('Recarregue a página')
                });
        }
    },
    watch: {
        startDate() {
            this.data = null;
        },
        endDate() {
            this.data = null;
        },
        clubSelected() {
            this.data = null;
        }
    },
    created() {
        setTimeout(() => this.startApp(), 500);
    }
});
