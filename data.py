import data.definition as dat
import collections

# ----------
SOURCE_FILENAME = 'japanese.dat'
# ----------

class Data():
    def __init__(self):
        self.sourfe_file_handle = open(SOURCE_FILENAME)
        self.occupation_file = open('japanese-occupation.csv', 'w')
        self.schooling_file = open('japanese-schooling.csv', 'w')
        self.year_born_file = open('japanese-year-born.csv', 'w')
        self.year_moved_us_file = open('japanese-moved-us.csv', 'w')
        self.highest_grade_file = open('japanese-highest-grade.csv', 'w')

        # Data
        self.fathers_occupation_us = dat.fathers_occupation_us()
        self.fathers_occupation_abroad = dat.fathers_occupation_abroad()
        self.schooling_in_japan = dat.schooling_in_japan();
        self.times_in_japan = dat.times_in_japan()
        self.time_in_japan = dat.time_in_japan()
        self.year_born = dat.year_born()
        self.moved_us = dat.moved_us()
        self.highest_grade = dat.highest_grade()

def fathers_occupation_us(p_data, p_l):
    # col18 - initial
    # col19 - war relocation project
    col = 27
    char = p_l[col]

    if char not in p_data.fathers_occupation_us.keys():
        p_data.fathers_occupation_us['invalid']['count'] += 1
    else:
        p_data.fathers_occupation_us[char]['count'] += 1

def fathers_occupation_abroad(p_data, p_l):
    col = 28
    char = p_l[col]

    if char not in p_data.fathers_occupation_abroad.keys():
        p_data.fathers_occupation_abroad['invalid']['count'] += 1
    else:
        p_data.fathers_occupation_abroad[char]['count'] += 1

def schooling_in_japan(p_data, p_l):
    col = 29
    char = p_l[col]

    if char not in p_data.schooling_in_japan.keys():
        print 'invalid: ' + char
        p_data.schooling_in_japan['invalid']['count'] += 1
    else:
        p_data.schooling_in_japan[char]['count'] += 1

def time_in_japan(p_data, p_l):
    col = 34
    char = p_l[col]

    if char not in p_data.time_in_japan.keys():
        p_data.time_in_japan['invalid']['count'] += 1
    else:
        p_data.time_in_japan[char]['count'] += 1

def times_in_japan(p_data, p_l):
    col = 35
    char = p_l[col]

    if char not in p_data.times_in_japan.keys():
        p_data.times_in_japan['invalid']['count'] += 1
    else:
        p_data.times_in_japan[char]['count'] += 1

def year_born(p_data, p_l):
    col = 46
    char = p_l[col]

    year = p_l[46] + '' + p_l[47]
    try:
        y = int(year)
        a = y / 10
        b = y % 10

        c = a * 10 # 80
        d = c + 4 # 84

        e = c + 5 # 85
        f = c + 9 # 89

        if a == 0:
            c_s = '00'
            d_s = '0' + '4'
            e_s = '0' + '5'
            f_s = '0' + '9'
        else:
            c_s = str(c)
            d_s = str(d)
            e_s = str(e)
            f_s = str(f)
        

        if e >= 45:
            # 1800s
            key2 = '18' + str(e_s) + '-' + '18' + str(f_s)
        else:
            # 1900s
            key2 = '19' + str(e_s) + '-' + '19' + str(f_s)
        
        if c <= 40:
            # 1800s
            key1 = '19' + str(c_s) + '-' + '19' + str(d_s)
        else:
            # 1900s
            key1 = '18' + str(c_s) + '-' + '18' + str(d_s)            


        if y >= c and y <= d:
            p_data.year_born[key1] = p_data.year_born.get(key1, 0) + 1
        elif y >= e and y <= f:
            p_data.year_born[key2] = p_data.year_born.get(key2, 0) + 1

        #p_data.year_born[year]['count'] = p_data.year_born.get(year, {'count' : 0}) + 1
        

    except:
        print 'INVALID YEAR: ' + str(year)

def moved_us(p_data, p_l):
    dat = p_l[32] + '' + p_l[33]

    if dat == '--':
        p_data.moved_us['never'] += 1 # American born, never in Japan
    elif dat == '  ':
        p_data.moved_us['has_been'] += 1 # American born, has been to Japan
    elif dat == '&&':
        p_data.moved_us['unknown'] += 1 # Unknown
    else:
        if len(dat) == 2:
            try:
                if int(dat) >= 0 and int(dat) <= 42:
                    actual_year = '19' + dat
                else:
                    actual_year = '18' + dat
                if ' ' not in actual_year:
                    p_data.moved_us[actual_year] = p_data.moved_us.get(actual_year, 0) + 1
            except:
                pass

def highest_grade(p_data, p_l):
    dat = p_l[51]

    p_data.highest_grade[dat] = p_data.highest_grade.get(dat, 0) + 1


def analyze(p_data, p_count):

    i = 0
    for line in p_data.sourfe_file_handle:
        
        # Call every function here
        fathers_occupation_us(p_data, line)
        fathers_occupation_abroad(p_data, line)
        schooling_in_japan(p_data, line)
        times_in_japan(p_data, line)
        time_in_japan(p_data, line)
        year_born(p_data, line)
        moved_us(p_data, line)
        highest_grade(p_data, line)
        # ----------

        i = i + 1
        if p_count > 0 and i >= p_count:
            break

    p_data.occupation_file.write('Description,US,Abroad\n')
    for k, v in p_data.fathers_occupation_us.iteritems():
        line = v['desc'] + ',' + str(v['count']) + ',' + str(p_data.fathers_occupation_abroad[k]['count']) + '\n'
        p_data.occupation_file.write(line)


    ordered_schooling = collections.OrderedDict(sorted(p_data.schooling_in_japan.items()))

    p_data.schooling_file.write('Description,Schooling\n')
    for k, v in ordered_schooling.iteritems():
        line = v['desc'] + ',' + str(v['count']) + '\n'
        p_data.schooling_file.write(line)

    year_born_ordered = collections.OrderedDict(sorted(p_data.year_born.items()))

    p_data.year_born_file.write('Year,Count\n')
    for k, v in year_born_ordered.iteritems():
        line = k + ',' + str(v) + '\n'
        p_data.year_born_file.write(line)

    moved_us_ordered = collections.OrderedDict(sorted(p_data.moved_us.items()))

    p_data.year_moved_us_file.write('Year,Count\n')
    for k, v in moved_us_ordered.iteritems():
        line = k + ',' + str(v) + '\n'
        p_data.year_moved_us_file.write(line)
    #print year_born_ordered

    highest_grade_ordered = collections.OrderedDict(sorted(p_data.highest_grade.items()))

    p_data.highest_grade_file.write('Symbol,Count\n')
    for k, v in highest_grade_ordered.iteritems():
        line = k + ',' + str(v) + '\n'
        p_data.highest_grade_file.write(line)

    print p_data.highest_grade
    #print p_data.moved_us
    #print p_data.fathers_occupation_us
    #print p_data.fathers_occupation_abroad
    #print p_data.schooling_in_japan
    #print p_data.times_in_japan
    #print p_data.time_in_japan
    #print p_data.year_born

def main():

    d = Data()

    analyze(d, 0)

if __name__ == '__main__':
    main()